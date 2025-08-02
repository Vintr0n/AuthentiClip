from fastapi_mail import ConnectionConfig

conf = ConnectionConfig(
    MAIL_USERNAME="noreply@clipcert.com",
    MAIL_PASSWORD="youwillneverguesswhativebeendoing",
    MAIL_FROM="noreply@clipcert.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.ionos.co.uk",  # or smtp.ionos.com for US servers
    MAIL_TLS=True,
    MAIL_SSL=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)
