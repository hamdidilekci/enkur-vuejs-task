import User from "../models/user.model.js";
// commons
import { encryptPassword, checkPassword } from "../common/index.js";

export default class UserService {
    // change password
    static async changePassword(currentUser, { newPassword, oldPassword }) {
        const user = await User.findOne({ _id: currentUser._id });

        if (!user) {
            throw new Error("User not found");
        }

        // check if password is valid
        const validPassword = await checkPassword(oldPassword, user.password);

        if (!validPassword) {
            throw new Error("Invalid password");
        }

        const hashedPassword = await encryptPassword(newPassword);

        await User.updateOne(
            { _id: currentUser._id },
            { $set: { password: hashedPassword } },
            { new: true }
        );

        return user;
    }
}
