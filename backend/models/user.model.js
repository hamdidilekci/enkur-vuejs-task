import { model, Schema } from "mongoose";
import isemail from "isemail";

const verificationSchema = new Schema({
    code: {
        type: String,
        default: null,
    },
    expireDate: {
        type: Date,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
});

const UserSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (v) => isemail.validate(v),
                message: (props) =>
                    `${props.value} is not a valid email address`,
            },
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            default: null,
        },
        phoneVerification: { type: verificationSchema },
        emailVerification: { type: verificationSchema },
    },
    {
        autoCreate: true,
        autoIndex: true,
        timestamps: true,
        collection: "user",
    }
);

UserSchema.set("toJSON", {
    transform: function (doc, ret, opt) {
        delete ret["password"];
        return ret;
    },
});

const User = model("User", UserSchema);

export default User;
