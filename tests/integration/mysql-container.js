import { GenericContainer, Wait} from "testcontainers"

let container

export async function startMySql() {
    container = await new GenericContainer("mysql:8.4")
        .withEnvironment({
            MYSQL_ROOT_PASSWORD: "root",
            MYSQL_DATABASE: "padel",
            MYSQL_USER: "test",
            MYSQL_PASSWORD: "test"
        })
        .withExposedPorts(3306)
        .withWaitStrategy(Wait.forListeningPorts())
        .start();

        return {
            host: container.getHost(),
            port: container.getMappedPort(3306),
            database: "padel",
            user: "test",
            password: "test"
        }
}

export async function stopMySql() {
  if (container) await container.stop();
  container = undefined;
}