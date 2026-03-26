import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// R2는 S3 호환 API 사용
const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

// presigned URL 발급 (클라이언트에서 직접 R2에 업로드)
export async function getUploadUrl(key: string, contentType: string) {
    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        ContentType: contentType,
    });
    // 5분 유효
    return getSignedUrl(r2, command, { expiresIn: 300 });
}

// 파일 삭제
export async function deleteFile(key: string) {
    await r2.send(
        new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
        }),
    );
}

// 공개 URL 조합
export function getPublicUrl(key: string) {
    return `${process.env.R2_PUBLIC_URL}/${key}`;
}
