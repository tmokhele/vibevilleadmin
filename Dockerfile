FROM noatun.dstv.com/run/openjre-8:latest
RUN mkdir /app
WORKDIR /app

COPY target/product-codes.jar product-codes.jar
EXPOSE 8080

CMD ["java", "-jar", "product-codes.jar"]