// import mongoose, { Schema } from "mongoose";

// const notificationSchema = new Schema(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     title: {
//       type: String,
//       required: true,
//     },
//     message: {
//       type: String,
//       required: true,
//     },
//     type: {
//       type: String,
//       enum: ["success", "info", "warning", "error"],
//       default: "info",
//     },
//     read: {
//       type: Boolean,
//       default: false,
//     },
//     link: {
//       type: String,
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Notification =
//   mongoose.models.Notification ||
//   mongoose.model("Notification", notificationSchema);

// export default Notification;
