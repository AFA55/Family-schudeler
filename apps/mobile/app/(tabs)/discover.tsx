import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import { colors } from "../../src/theme/colors";

const categories = [
  { id: "all", label: "All", emoji: "✨" },
  { id: "outdoor", label: "Outdoor", emoji: "🌿" },
  { id: "dining", label: "Dining", emoji: "🍕" },
  { id: "games", label: "Games", emoji: "🎲" },
  { id: "adventure", label: "Adventure", emoji: "🥾" },
  { id: "crafts", label: "Crafts", emoji: "🎨" },
  { id: "free", label: "Free", emoji: "🆓" },
];

const recommendations = [
  {
    id: "1",
    title: "Sunset Trail Hike",
    description: "Beautiful 3-mile trail with scenic overlooks. Great for families with kids 5+.",
    category: "outdoor",
    cost: "Free",
    distance: "4.2 mi",
    rating: 4.8,
    reviews: 234,
    emoji: "🥾",
    color: colors.success[500],
  },
  {
    id: "2",
    title: "Tony's Italian Kitchen",
    description: "Family-friendly Italian restaurant with spacious seating and kids menu.",
    category: "dining",
    cost: "$$",
    distance: "1.8 mi",
    rating: 4.6,
    reviews: 412,
    emoji: "🍝",
    color: colors.amber[500],
  },
  {
    id: "3",
    title: "Board Game Cafe",
    description: "Over 500 board games to play. Great for rainy days. Snacks and drinks available.",
    category: "games",
    cost: "$",
    distance: "3.1 mi",
    rating: 4.7,
    reviews: 189,
    emoji: "🎲",
    color: colors.primary[500],
  },
  {
    id: "4",
    title: "DIY Pottery Workshop",
    description: "Create your own pottery. Fun for all ages. All materials included.",
    category: "crafts",
    cost: "$$",
    distance: "5.5 mi",
    rating: 4.9,
    reviews: 87,
    emoji: "🏺",
    color: colors.coral[500],
  },
];

export default function DiscoverScreen() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = activeCategory === "all"
    ? recommendations
    : recommendations.filter((r) => r.category === activeCategory);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.headerSubtitle}>
          Activities & experiences near you
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search activities, restaurants..."
          placeholderTextColor={colors.neutral[400]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryChip,
              activeCategory === cat.id && styles.categoryChipActive,
            ]}
            onPress={() => setActiveCategory(cat.id)}
          >
            <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
            <Text
              style={[
                styles.categoryLabel,
                activeCategory === cat.id && styles.categoryLabelActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* AI Assistant prompt */}
      <TouchableOpacity style={styles.aiCard}>
        <View style={styles.aiIcon}>
          <Text style={styles.aiIconText}>🤖</Text>
        </View>
        <View style={styles.aiContent}>
          <Text style={styles.aiTitle}>AI Planning Assistant</Text>
          <Text style={styles.aiSubtitle}>
            &quot;Find a spacious restaurant for my family of 12...&quot;
          </Text>
        </View>
        <Text style={styles.aiArrow}>→</Text>
      </TouchableOpacity>

      {/* Recommendations */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.listScroll}>
        {filtered.map((item) => (
          <TouchableOpacity key={item.id} style={styles.recCard}>
            <View style={[styles.recEmoji, { backgroundColor: `${item.color}15` }]}>
              <Text style={styles.recEmojiText}>{item.emoji}</Text>
            </View>
            <View style={styles.recContent}>
              <Text style={styles.recTitle}>{item.title}</Text>
              <Text style={styles.recDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.recMeta}>
                <Text style={styles.recRating}>⭐ {item.rating}</Text>
                <Text style={styles.recDot}>·</Text>
                <Text style={styles.recCost}>{item.cost}</Text>
                <Text style={styles.recDot}>·</Text>
                <Text style={styles.recDistance}>{item.distance}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.scheduleButton}>
              <Text style={styles.scheduleButtonText}>Schedule</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.neutral[900],
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.neutral[400],
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.neutral[800],
  },
  categoriesScroll: {
    marginTop: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: "row",
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  categoryEmoji: {
    fontSize: 14,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.neutral[600],
  },
  categoryLabelActive: {
    color: "white",
  },
  aiCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary[50],
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  aiIconText: {
    fontSize: 20,
  },
  aiContent: {
    flex: 1,
    marginLeft: 12,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary[700],
  },
  aiSubtitle: {
    fontSize: 12,
    color: colors.primary[400],
    marginTop: 2,
  },
  aiArrow: {
    fontSize: 18,
    color: colors.primary[400],
  },
  listScroll: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  recCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  recEmoji: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  recEmojiText: {
    fontSize: 24,
  },
  recContent: {
    flex: 1,
    marginLeft: 12,
  },
  recTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.neutral[800],
  },
  recDescription: {
    fontSize: 12,
    color: colors.neutral[400],
    marginTop: 2,
    lineHeight: 16,
  },
  recMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  recRating: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.neutral[600],
  },
  recDot: {
    color: colors.neutral[300],
    fontSize: 10,
  },
  recCost: {
    fontSize: 12,
    color: colors.neutral[500],
  },
  recDistance: {
    fontSize: 12,
    color: colors.neutral[400],
  },
  scheduleButton: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  scheduleButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary[600],
  },
});
