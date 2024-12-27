import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Generate a unique token
const generateToken = (): string =>
  Math.floor(Math.random() * 100000).toString().padStart(5, "0");

// Fetch pending orders
export const getPendingOrders = async (req: Request, res: Response) => {
  try {
    const pendingOrders = await prisma.orders.findMany({
      where: { status: "Pending" },
      include: {
        OrderDetails: {
          include: {
            products: true, // Assuming a relation exists with the product table
          },
        },
      },
    });

    // Assign tokens if not already assigned
    await Promise.all(
      pendingOrders.map(async (order) => {
        if (!order.token) {
          const token = generateToken();
          await prisma.orders.update({
            where: { orderId: order.orderId },
            data: { token },
          });
          order.token = token;
        }
      })
    );

    // Format the response to include required data
    const formattedOrders = pendingOrders.map((order) => ({
      token: order.token,
      orderId: order.orderId,
      products: order.OrderDetails.map((detail) => ({
        name: detail.products?.name || "Unknown",
        quantity: detail.qty,
        price: detail.price,
      })),
      totalCost: order.OrderDetails.reduce(
        (sum, detail) => sum + detail.price,
        0
      ),
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching pending orders" });
  }
};

// Fetch completed orders
export const getCompletedOrders = async (req: Request, res: Response) => {
  try {
    const completedOrders = await prisma.orders.findMany({
      where: { status: "Completed" },
      include: {
        OrderDetails: {
          include: {
            products: true,
          },
        },
      },
    });

    await Promise.all(
      completedOrders.map(async (order) => {
        if (!order.token) {
          const token = generateToken();
          await prisma.orders.update({
            where: { orderId: order.orderId },
            data: { token },
          });
          order.token = token;
        }
      })
    );

    // Format the response to include required data
    const formattedOrders = completedOrders.map((order) => ({
      token: order.token,
      orderId: order.orderId,
      products: order.OrderDetails.map((detail) => ({
        name: detail.products?.name || "Unknown",
        quantity: detail.qty,
        price: detail.price,
      })),
      totalCost: order.OrderDetails.reduce(
        (sum, detail) => sum + detail.qty * detail.price,
        0
      ),
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching completed orders" });
  }
};

// Fetch or update the current token
export const getCurrentToken = async (req: Request, res: Response) => {
  try {
    const nextOrder = await prisma.orders.findFirst({
      where: { status: "Pending" },
      orderBy: { placedAt: "asc" }, // Fetch the oldest pending order
    });

    if (nextOrder) {
      res.status(200).json({ currentToken: nextOrder.token });
    } else {
      res.status(200).json({ message: "No orders are currently pending." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching current token" });
  }
};