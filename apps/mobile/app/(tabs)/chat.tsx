import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { colors } from "../../src/theme/colors";

const mockMessages = [
  {
    id: "1",
    sender: "Sarah",
    content: "Hey! My family is coming over this weekend. Want to find a nice restaurant that can fit all of us? Maybe Italian or American?",
    isAI: false,
    time: "2:30 PM",
  },
  {
    id: "2",
    sender: "AI Assistant",
    content: "I found 3 great options near you that can accommodate large groups:\n\n🍝 Tony's Italian Kitchen - 4.6⭐ (seats 20+, $$$)\n🥩 The American Table - 4.5⭐ (private room available, $$)\n🍕 Famiglia Pizza & Grill - 4.8⭐ (outdoor patio, $$)\n\nWould you like me to check availability for this Saturday?",
    isAI: true,
    time: "2:31 PM",
  },
  {
    id: "3",
    sender: "Marcus",
    content: "Famiglia Pizza looks great! Can you check if they have space for 12 people Saturday at 6pm?",
    isAI: false,
    time: "2:33 PM",
  },
];

export default function ChatScreen() {
  const [message, setMessage] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Family Chat</Text>
        <TouchableOpacity style={styles.aiToggle}>
          <Text style={styles.aiToggleText}>🤖 AI On</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
      >
        {/* AI intro card */}
        <View style={styles.aiIntroCard}>
          <Text style={styles.aiIntroEmoji}>🤖</Text>
          <Text style={styles.aiIntroTitle}>AI Planning Assistant</Text>
          <Text style={styles.aiIntroText}>
            Ask me anything! &quot;Find a restaurant for 12 people,&quot;
            &quot;suggest weekend hiking trails,&quot; or &quot;plan a game
            night.&quot;
          </Text>
        </View>

        {mockMessages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.isAI ? styles.aiBubble : styles.userBubble,
            ]}
          >
            <View style={styles.messageHeader}>
              <Text
                style={[
                  styles.senderName,
                  msg.isAI && styles.aiSenderName,
                ]}
              >
                {msg.isAI ? "🤖 " : ""}
                {msg.sender}
              </Text>
              <Text style={styles.messageTime}>{msg.time}</Text>
            </View>
            <Text style={[styles.messageText, msg.isAI && styles.aiMessageText]}>
              {msg.content}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Plan something together..."
          placeholderTextColor={colors.neutral[400]}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendText}>↑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.neutral[900],
  },
  aiToggle: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  aiToggleText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary[600],
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 16,
    gap: 12,
  },
  aiIntroCard: {
    backgroundColor: colors.primary[50],
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 8,
  },
  aiIntroEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  aiIntroTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary[700],
    marginBottom: 4,
  },
  aiIntroText: {
    fontSize: 13,
    color: colors.primary[500],
    textAlign: "center",
    lineHeight: 18,
  },
  messageBubble: {
    borderRadius: 16,
    padding: 14,
    maxWidth: "85%",
  },
  userBubble: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  aiBubble: {
    backgroundColor: colors.primary[50],
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  senderName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.neutral[700],
  },
  aiSenderName: {
    color: colors.primary[600],
  },
  messageTime: {
    fontSize: 11,
    color: colors.neutral[400],
  },
  messageText: {
    fontSize: 14,
    color: colors.neutral[700],
    lineHeight: 20,
  },
  aiMessageText: {
    color: colors.primary[800],
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    paddingBottom: 32,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.neutral[50],
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.neutral[800],
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  sendText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
