import { Webhook } from "svix";
import User from "../models/user.js";

// API Controller Function to Manage Clerk User with Database
export const clerkWebhooks = async (req, res) => {
    try {
        // Create a Svix instance with Clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Verify headers
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        // Extract data and event type
        const { data, type } = req.body;

        switch (type) {

            // Create or overwrite user document on creation
            case 'user.created': {
                console.log("Webhook: user.created | ID:", data.id);

                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                    resume: ''
                };

                try {
                    await User.findByIdAndUpdate(
                        data.id,
                        userData,
                        { upsert: true, new: true }
                    );
                    console.log("User upserted (created or updated).");
                } catch (err) {
                    console.error("Error upserting user:", err.message);
                }

                res.json({});
                break;
            }

            // Update existing user
            case 'user.updated': {
                console.log("Webhook: user.updated | ID:", data.id);

                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                };

                try {
                    await User.findByIdAndUpdate(data.id, userData);
                    console.log("User updated.");
                } catch (err) {
                    console.error("Error updating user:", err.message);
                }

                res.json({});
                break;
            }

            // Delete user from DB
            case 'user.deleted': {
                console.log("Webhook: user.deleted | ID:", data.id);

                try {
                    await User.findByIdAndDelete(data.id);
                    console.log("User deleted.");
                } catch (err) {
                    console.error("Error deleting user:", err.message);
                }

                res.json({});
                break;
            }

            default:
                console.log("Unhandled webhook type:", type);
                res.json({});
                break;
        }

    } catch (error) {
        console.error("Webhook error:", error.message);
        res.json({ success: false, message: 'Webhooks Error' });
    }
};
