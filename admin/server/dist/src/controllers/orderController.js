"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentToken = exports.getCompletedOrders = exports.getPendingOrders = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Generate a unique token
const generateToken = () => Math.floor(Math.random() * 100000).toString().padStart(5, "0");
// Fetch pending orders
const getPendingOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pendingOrders = yield prisma.orders.findMany({
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
        yield Promise.all(pendingOrders.map((order) => __awaiter(void 0, void 0, void 0, function* () {
            if (!order.token) {
                const token = generateToken();
                yield prisma.orders.update({
                    where: { orderId: order.orderId },
                    data: { token },
                });
                order.token = token;
            }
        })));
        // Format the response to include required data
        const formattedOrders = pendingOrders.map((order) => ({
            token: order.token,
            orderId: order.orderId,
            products: order.OrderDetails.map((detail) => {
                var _a;
                return ({
                    name: ((_a = detail.products) === null || _a === void 0 ? void 0 : _a.name) || "Unknown",
                    quantity: detail.qty,
                    price: detail.price,
                });
            }),
            totalCost: order.OrderDetails.reduce((sum, detail) => sum + detail.price, 0),
        }));
        res.status(200).json(formattedOrders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching pending orders" });
    }
});
exports.getPendingOrders = getPendingOrders;
// Fetch completed orders
const getCompletedOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const completedOrders = yield prisma.orders.findMany({
            where: { status: "Completed" },
            include: {
                OrderDetails: {
                    include: {
                        products: true,
                    },
                },
            },
        });
        yield Promise.all(completedOrders.map((order) => __awaiter(void 0, void 0, void 0, function* () {
            if (!order.token) {
                const token = generateToken();
                yield prisma.orders.update({
                    where: { orderId: order.orderId },
                    data: { token },
                });
                order.token = token;
            }
        })));
        // Format the response to include required data
        const formattedOrders = completedOrders.map((order) => ({
            token: order.token,
            orderId: order.orderId,
            products: order.OrderDetails.map((detail) => {
                var _a;
                return ({
                    name: ((_a = detail.products) === null || _a === void 0 ? void 0 : _a.name) || "Unknown",
                    quantity: detail.qty,
                    price: detail.price,
                });
            }),
            totalCost: order.OrderDetails.reduce((sum, detail) => sum + detail.qty * detail.price, 0),
        }));
        res.status(200).json(formattedOrders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching completed orders" });
    }
});
exports.getCompletedOrders = getCompletedOrders;
// Fetch or update the current token
const getCurrentToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nextOrder = yield prisma.orders.findFirst({
            where: { status: "Pending" },
            orderBy: { placedAt: "asc" }, // Fetch the oldest pending order
        });
        if (nextOrder) {
            res.status(200).json({ currentToken: nextOrder.token });
        }
        else {
            res.status(200).json({ message: "No orders are currently pending." });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching current token" });
    }
});
exports.getCurrentToken = getCurrentToken;
