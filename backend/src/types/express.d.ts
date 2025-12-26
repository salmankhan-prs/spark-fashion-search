import type { JWTPayload } from "@/api/auth/auth.types";

declare global {
	namespace Express {
		interface Request {
			user?: JWTPayload;
		}
	}
}
