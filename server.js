const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
mongoose.connect("mongodb+srv://chaithranaik:chaithra123@cluster0.guocpbh.mongodb.net/synergiaDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  event: String,
  ticketType: String,
  createdAt: { type: Date, default: Date.now }
});
const Booking = mongoose.model("Booking", bookingSchema);
app.post("/api/bookings", async (req, res) => {
  try {
    const { name, email, event, ticketType } = req.body;

    if (!name || !email || !event || !ticketType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const booking = new Booking({ name, email, event, ticketType });
    await booking.save();
    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/bookings", async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
});
app.get("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch {
    res.status(400).json({ message: "Invalid ID format" });
  }
});
app.put("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking updated", booking });
  } catch {
    res.status(400).json({ message: "Invalid ID format" });
  }
});
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted" });
  } catch {
    res.status(400).json({ message: "Invalid ID format" });
  }
});
app.get("/api/bookings/search", async (req, res) => {
  const { email } = req.query;
  const booking = await Booking.findOne({ email });
  if (!booking) return res.status(404).json({ message: "No booking found" });
  res.json(booking);
});
app.get("/api/bookings/filter", async (req, res) => {
  const { event } = req.query;
  const bookings = await Booking.find({ event });
  res.json(bookings);
});
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

