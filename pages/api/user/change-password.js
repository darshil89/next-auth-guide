import { getSession } from "next-auth/react";
import { connectToDatabase } from "@/lip/db";
import { hashPassword, verifyPassword } from "@/lip/auth";
async function handler(req, res) {
  if (req.method === "PATCH") {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).json({ message: session });
      return;
    }

    const userEmail = session.user.email;

    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const client = await connectToDatabase();

    const usersCollection = client.db().collection("users");

    const user = await usersCollection.findOne({ email: userEmail });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      client.close();
      return;
    }

    // verify old password
    const currentPassword = user.password;

    const isValid = await verifyPassword(oldPassword, currentPassword);

    if (!isValid) {
      res.status(403).json({ message: "Invalid password." });
      client.close();
      return;
    }

    // update password

    const hashedPassword = await hashPassword(newPassword);

    const result = await usersCollection.updateOne(
      {
        email: userEmail,
      },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );
    console.log(result);
    client.close();
    res.status(200).json({ message: "Password updated!" });
  }
}

export default handler;
