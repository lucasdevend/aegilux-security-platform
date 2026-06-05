import tls from "tls";

export async function getSSLInfo(
    domain: string
) {
    return new Promise((resolve, reject) => {

        const socket = tls.connect(
            443,
            domain,
            {
                servername: domain,
            },
            () => {

                const cert =
                    socket.getPeerCertificate();

                socket.end();

                resolve({
                    valid: true,
                    issuer:
                        cert.issuer?.O ||
                        "Unknown",
                    validFrom:
                        cert.valid_from ||
                        "Unknown",
                    validTo:
                        cert.valid_to ||
                        "Unknown",
                    subject:
                        cert.subject?.CN ||
                        domain,
                });
            }
        );

        socket.on("error", (err) => {
            reject(err);
        });
    });
}