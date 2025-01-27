// import com.google.api.client.auth.oauth2.Credential;
// import com.google.api.client.auth.oauth2.GoogleAuthorizationCodeFlow;
// import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
// import com.google.api.client.extensions.java6.auth.oauth2.FileCredentialStore;
// import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
// import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
// import com.google.api.client.http.HttpTransport;
// import com.google.api.client.json.JsonFactory;
// import com.google.api.client.json.jackson2.JacksonFactory;
// import com.google.api.client.util.store.FileDataStoreFactory;
// import com.google.api.services.gmail.Gmail;
// import com.google.api.services.gmail.model.Message;
// import com.google.api.services.gmail.GmailScopes;
// import jakarta.mail.*;
// import jakarta.mail.internet.*;

// import java.io.*;
// import java.security.GeneralSecurityException;
// import java.util.*;
// import java.util.Base64;

// public class GmailService {
//     private static final String APPLICATION_NAME = "Pro Dan Cake";
//     private static final List<String> SCOPES = Collections.singletonList(GmailScopes.GMAIL_SEND);
//     private static final HttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
//     private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
//     private static final String CREDENTIALS_FILE_PATH = "path/to/credentials.json";
//     private static final String TOKENS_DIRECTORY_PATH = "tokens";

//     private static Credential authorize() throws Exception {
//         InputStream in = new FileInputStream(CREDENTIALS_FILE_PATH);
//         GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

//         FileDataStoreFactory dataStoreFactory = new FileDataStoreFactory(new File(TOKENS_DIRECTORY_PATH));
//         GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
//                 HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
//                 .setDataStoreFactory(dataStoreFactory)
//                 .setAccessType("offline")
//                 .build();
//         return new AuthorizationCodeInstalledApp(flow, new LocalServerReceiver()).authorize("user");
//     }

//     public static Gmail getGmailService() throws Exception {
//         Credential credential = authorize();
//         return new Gmail.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
//                 .setApplicationName(APPLICATION_NAME)
//                 .build();
//     }

//     public static MimeMessage createEmail(String to, String from, String subject, String bodyText) throws MessagingException {
//         Properties props = new Properties();
//         Session session = Session.getDefaultInstance(props, null);
//         MimeMessage email = new MimeMessage(session);
//         email.setFrom(new InternetAddress(from));
//         email.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
//         email.setSubject(subject);
//         email.setText(bodyText);
//         return email;
//     }

//     public static void sendMessage(Gmail service, String userId, MimeMessage email) throws IOException, MessagingException {
//         Message message = createMessageWithEmail(email);
//         service.users().messages().send(userId, message).execute();
//     }

//     private static Message createMessageWithEmail(MimeMessage email) throws MessagingException, IOException {
//         ByteArrayOutputStream buffer = new ByteArrayOutputStream();
//         email.writeTo(buffer);
//         byte[] rawBytes = buffer.toByteArray();
//         String encodedEmail = Base64.getUrlEncoder().encodeToString(rawBytes);
//         Message message = new Message();
//         message.setRaw(encodedEmail);
//         return message;
//     }
// }
