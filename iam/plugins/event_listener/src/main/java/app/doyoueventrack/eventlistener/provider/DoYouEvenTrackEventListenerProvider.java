package app.doyoueventrack.eventlistener.provider;

import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventType;
import org.keycloak.events.admin.AdminEvent;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;


public class DoYouEvenTrackEventListenerProvider implements EventListenerProvider {

    private final KeycloakSession session;

    public DoYouEvenTrackEventListenerProvider(KeycloakSession session) {
        this.session = session;
    }

    @Override
    public void onEvent(Event event) {
        System.out.println("Event Occurred:" + toString(event));
        if (event.getType() == EventType.VERIFY_EMAIL) {
            RealmModel realm = session.realms().getRealm(event.getRealmId());
            UserModel user = session.users().getUserById(event.getUserId(), realm);
            try {
                this.postSubscriberToListmonk(user.getFirstName() + " " + user.getLastName(), user.getEmail());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public void postSubscriberToListmonk(String name, String email) throws IOException{
        System.out.println("Posting subscriber: " + email + " to Listmonk.");
        URL url = new URL ("http://listmonk/api/subscribers");
        HttpURLConnection connection = (HttpURLConnection)url.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json; utf-8");
        connection.setRequestProperty("Accept", "application/json");
        String encoded = Base64.getEncoder().encodeToString(("admin:admin").getBytes(StandardCharsets.UTF_8));
        connection.setRequestProperty("Authorization", "Basic "+encoded);
        connection.setDoOutput(true);
        String jsonInputString = String.format("{\"name\": \"%s\", \"email\": \"%s\", \"lists\":[1], \"status\": \"enabled\"}", name, email);

        try(OutputStream os = connection.getOutputStream()) {
            byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        try(BufferedReader br = new BufferedReader(
                new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
            StringBuilder response = new StringBuilder();
            String responseLine = null;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }
            System.out.println(response.toString());
        }

    }

    @Override
    public void onEvent(AdminEvent event, boolean b) {
        System.out.println("Admin Event Occurred:" + toString(event));
    }

    @Override
    public void close() {

    }

    private String toString(Event event) {
        StringBuilder sb = new StringBuilder();
        sb.append("type=");
        sb.append(event.getType());
        sb.append(", realmId=");
        sb.append(event.getRealmId());
        sb.append(", clientId=");
        sb.append(event.getClientId());
        sb.append(", userId=");
        sb.append(event.getUserId());
        sb.append(", ipAddress=");
        sb.append(event.getIpAddress());
        if (event.getError() != null) {
            sb.append(", error=");
            sb.append(event.getError());
        }


        if (event.getDetails() != null) {
            for (Map.Entry<String, String> e : event.getDetails().entrySet()) {
                sb.append(", ");
                sb.append(e.getKey());
                if (e.getValue() == null || e.getValue().indexOf(' ') == -1) {
                    sb.append("=");
                    sb.append(e.getValue());
                } else {
                    sb.append("='");
                    sb.append(e.getValue());
                    sb.append("'");
                }
            }
        }
        return sb.toString();
    }


    private String toString(AdminEvent adminEvent) {
        StringBuilder sb = new StringBuilder();
        sb.append("operationType=");
        sb.append(adminEvent.getOperationType());
        sb.append(", realmId=");
        sb.append(adminEvent.getAuthDetails().getRealmId());
        sb.append(", clientId=");
        sb.append(adminEvent.getAuthDetails().getClientId());
        sb.append(", userId=");
        sb.append(adminEvent.getAuthDetails().getUserId());
        sb.append(", ipAddress=");
        sb.append(adminEvent.getAuthDetails().getIpAddress());
        sb.append(", resourcePath=");
        sb.append(adminEvent.getResourcePath());
        if (adminEvent.getError() != null) {
            sb.append(", error=");
            sb.append(adminEvent.getError());
        }
        return sb.toString();

    }
}