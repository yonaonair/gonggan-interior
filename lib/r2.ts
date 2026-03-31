import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import https from "https";

/**
 * 개발환경(Windows)에서 Node.js 24 + Cloudflare R2 간 TLS 핸드셰이크 실패를 우회.
 * 프로덕션(Vercel/Linux)은 정상 검증 유지.
 */
const httpsAgent = new https.Agent({
    rejectUnauthorized: process.env.NODE_ENV === "production",
});

const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
    requestHandler: new NodeHttpHandler({ httpsAgent }),
});

/** 서버에서 직접 R2에 파일 업로드 */
export async function uploadFile(key: string, body: Buffer, contentType: string) {
    await r2.send(
        new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
            Body: body,
            ContentType: contentType,
        }),
    );
}

export async function deleteFile(key: string) {
    await r2.send(
        new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
        }),
    );
}

export function getPublicUrl(key: string) {
    // NEXT_PUBLIC_ 접두사가 있어야 클라이언트에서도 접근 가능
    const base =
        process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? process.env.R2_PUBLIC_URL;
    return `${base}/${key}`;
}

/** presigned URL — 현재 미사용, 참조용으로 유지 */
export async function getUploadUrl(key: string, contentType: string) {
    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        ContentType: contentType,
    });
    return getSignedUrl(r2, command, { expiresIn: 300 });
}
