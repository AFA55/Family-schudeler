import { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../src/theme/colors";
import { useDiscoverStore } from "../../src/store/discoverStore";

const categories = [
  { id: "all", label: "All", emoji: "✨" },
  { id: "trending", label: "Trending", emoji: "🔥" },
  { id: "outdoor", label: "Outdoor", emoji: "🌿" },
  { id: "dining", label: "Dining", emoji: "🍕" },
  { id: "games", label: "Games", emoji: "🎲" },
  { id: "adventure", label: "Adventure", emoji: "🥾" },
  { id: "crafts", label: "Crafts", emoji: "🎨" },
  { id: "free", label: "Free", emoji: "🆓" },
];

const CATEGORY_EMOJI: Record<string, string> = {
  outdoor: "🥾",
  dining: "🍝",
  games: "🎲",
  adventure: "🥾",
  crafts: "🏺",
  sports: "⚽",
  free: "🆓",
};

const CATEGORY_COLOR: Record<string, string> = {
  outdoor: colors.success[500],
  dining: colors.amber[500],
  games: colors.primary[500],
  adventure: colors.success[500],
  crafts: colors.coral[500],
  sports: colors.primary[500],
  free: colors.success[500],
};

export default function DiscoverScreen() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { trending, activities, isLoading, fetchFeed } = useDiscoverStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setError(null);
      try {
        await fetchFeed({});
      } catch {
        setError("Failed to load recommendations.");
      }
    };
    load();
  }, []);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    const params = catId === "all" || catId === "trending" ? {} : { category: catId };
    setError(null);
    fetchFeed(params).catch(() => setError("Failed to load recommendations."));
  };

  // Map store activities to the display format used by the UI
  const recommendations = useMemo(
    () =>
      activities.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        category: a.category?.toLowerCase() ?? "general",
        cost: a.cost ?? "Free",
        distance: "",
        rating: a.rating ?? 0,
        reviews: a.reviewCount ?? 0,
        emoji: CATEGORY_EMOJI[a.category?.toLowerCase()] ?? "📌",
        color: CATEGORY_COLOR[a.category?.toLowerCase()] ?? colors.neutral[500],
      })),
    [activities]
  );

  const filtered =
    activeCategory === "all" || activeCategory === "trending"
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
            onPress={() => handleCategoryChange(cat.id)}
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
        {/* Loading state */}
        {isLoading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={colors.primary[500]} />
            <Text style={styles.loadingText}>Loading recommendations...</Text>
          </View>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setError(null);
                fetchFeed({}).catch(() =>
                  setError("Failed to load recommendations.")
                );
              }}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Trending from Social Media */}
        {(activeCategory === "all" || activeCategory === "trending") &&
          trending.length > 0 && (
          <View style={styles.trendingSection}>
            <View style={styles.trendingHeader}>
              <Text style={styles.trendingSectionTitle}>Trending Near You</Text>
              <Text style={styles.trendingSourceBadge}>From social media</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.trendingRow}>
                {trending.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.trendingCard}>
                    <View style={styles.trendingImagePlaceholder}>
                      <Text style={styles.trendingPlayIcon}>▶</Text>
                    </View>
                    <View style={styles.trendingSourceTag}>
                      <Text style={styles.trendingSourceText}>
                        {item.source === "TikTok" ? "🎵 TikTok" : "📸 " + item.source}
                      </Text>
                    </View>
                    <Text style={styles.trendingTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.trendingDescription} numberOfLines={2}>{item.description}</Text>
                    <Text style={styles.trendingLocation} numberOfLines={1}>
                      📍 {item.city}{item.state ? `, ${item.state}` : ""}
                    </Text>
                    <TouchableOpacity style={styles.trendingScheduleBtn}>
                      <Text style={styles.trendingScheduleText}>+ Schedule</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Curated Recommendations */}
        <Text style={styles.curatedTitle}>Recommended For You</Text>
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
  // Trending section styles
  trendingSection: {
    marginBottom: 20,
  },
  trendingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  trendingSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.neutral[800],
  },
  trendingSourceBadge: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.coral[500],
    backgroundColor: colors.coral[50],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: "hidden",
  },
  trendingRow: {
    flexDirection: "row",
    gap: 12,
    paddingRight: 16,
  },
  trendingCard: {
    width: 180,
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  trendingImagePlaceholder: {
    height: 120,
    backgroundColor: colors.neutral[800],
    alignItems: "center",
    justifyContent: "center",
  },
  trendingPlayIcon: {
    color: "white",
    fontSize: 32,
    opacity: 0.8,
  },
  trendingSourceTag: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  trendingSourceText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },
  trendingTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.neutral[800],
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  trendingDescription: {
    fontSize: 11,
    color: colors.neutral[500],
    paddingHorizontal: 10,
    marginTop: 2,
    lineHeight: 15,
  },
  trendingLocation: {
    fontSize: 11,
    color: colors.neutral[500],
    paddingHorizontal: 10,
    marginTop: 4,
  },
  trendingScheduleBtn: {
    margin: 10,
    backgroundColor: colors.coral[50],
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  trendingScheduleText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.coral[500],
  },
  curatedTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.neutral[800],
    marginBottom: 12,
    marginTop: 4,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: colors.neutral[400],
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  errorText: {
    fontSize: 14,
    color: colors.coral[500],
    textAlign: "center",
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryText: {
    color: colors.primary[600],
    fontWeight: "600",
    fontSize: 14,
  },
});
