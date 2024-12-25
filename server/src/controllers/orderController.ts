import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const status = req.query.status?.toString();

    // Fetch orders with related user and order details
    const orders = await prisma.orders.findMany({
      where: {
        ...(status && { status }), // Filter by status if provided
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        OrderDetails: {
          include: {
            products: {
              select: {
                name: true,
                category: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
