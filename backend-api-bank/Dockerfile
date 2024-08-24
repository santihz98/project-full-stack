# Usar una imagen base de OpenJDK con JDK 17
FROM openjdk:17-jdk-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el archivo JAR generado en el contenedor
COPY build/libs/bank-0.0.1-SNAPSHOT.jar app.jar

# Exponer el puerto en el que corre la aplicación
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]

