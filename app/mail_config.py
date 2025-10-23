from fastapi_mail import ConnectionConfig

conf = ConnectionConfig(
    MAIL_USERNAME="noreply@clipcert.com",
    MAIL_PASSWORD="youwillneverguesswhativebeendoing",
    MAIL_FROM="noreply@clipcert.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.ionos.com",
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)
