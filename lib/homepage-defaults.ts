const field = (label: string, value: string, multiline = false) => ({
  label,
  value,
  multiline,
});

export const homepageDefinitions = {
  announcement: {
    label: "Announcement bar",
    fields: {
      message: field("Message", "YOUR NEXT ADVANTAGE STARTS HERE"),
      link: field("Discord link label", "JOIN THE JUST ZOLE COMMUNITY"),
    },
  },
  navigation: {
    label: "Header & navigation",
    fields: {
      brandFirst: field("Brand first word", "JUST"),
      brandLast: field("Brand second word", "ZOLE"),
      brandTagline: field("Brand tagline", "BUILT FOR THE ADVANTAGE"),
      brandSymbol: field("Brand symbol", "Z"),
      products: field("Products link", "Products"),
      howItWorks: field("How it works link", "How it works"),
      howToUse: field("How to use link", "How to use"),
      reviews: field("Reviews link", "Reviews"),
      rules: field("Rules link", "Rules"),
      community: field("Community link", "Community"),
      signIn: field("Sign in label", "Sign in"),
      signOut: field("Sign out label", "Sign out"),
      dashboard: field("Admin dashboard link", "Dashboard"),
      joinDiscord: field("Discord button", "Join Discord"),
    },
  },
  hero: {
    label: "Hero",
    fields: {
      eyebrow: field("Eyebrow", "THE JUST ZOLE COLLECTION"),
      titleFirst: field("Headline first line", "YOUR GAME."),
      titleSecond: field("Headline second line", "YOUR"),
      titleAccent: field("Highlighted headline", "EDGE."),
      description: field(
        "Description",
        "Go beyond the ordinary. Discover game scripts and tools built to change the way you play.",
        true,
      ),
      productsButton: field("Products button", "Explore products"),
      communityButton: field("Discord button", "Join the community"),
      note: field("Community note", "A community for players who want more."),
      visualTop: field("Artwork top label", "JZ / SYSTEM ONLINE"),
      visualLabel: field("Artwork badge", "THE ADVANTAGE IS YOURS"),
      visualBottom: field(
        "Artwork bottom label",
        "PLAY BEYOND LIMITS — JUST ZOLE",
      ),
      visualSymbol: field("Artwork letter", "Z"),
    },
  },
  benefits: {
    label: "Benefits strip",
    fields: {
      first: field("First benefit", "Made for your game"),
      second: field("Second benefit", "Ready for the next level"),
      third: field("Third benefit", "Support on Discord"),
      fourth: field("Fourth benefit", "Community comes first"),
    },
  },
  products: {
    label: "Product collection",
    fields: {
      eyebrow: field("Eyebrow", "THE ARSENAL"),
      title: field("Heading", "Find your next advantage."),
      description: field(
        "Description",
        "Explore the collection. Find your fit. Make it yours on Discord.",
      ),
      viewAll: field("View all link", "View all products"),
      allProducts: field("All products filter", "All products"),
      search: field("Search placeholder", "Search your next advantage..."),
      allGames: field("All games filter", "All games"),
      newest: field("Newest sort", "Newest first"),
      featured: field("Featured sort", "Featured first"),
      priceLow: field("Price sort", "Price: low to high"),
      nameSort: field("Name sort", "Name: A–Z"),
      singular: field("Singular product label", "product"),
      plural: field("Plural product label", "products"),
      countSuffix: field("Product count suffix", "to explore"),
      noMatchTitle: field(
        "No search results heading",
        "No products match your search",
      ),
      noMatchDescription: field(
        "No search results description",
        "Try another game, category, or search term.",
      ),
      emptyTitle: field(
        "Empty catalog heading",
        "The next drop is on its way.",
      ),
      emptyDescription: field(
        "Empty catalog description",
        "New scripts. New possibilities. Join Discord to see what’s available and hear about upcoming releases.",
        true,
      ),
      clearFilters: field("Clear filters button", "Clear filters"),
      communityButton: field("Empty catalog button", "Explore the community"),
      cardView: field("Product card link", "View product"),
      cardPricing: field("Product card unspecified price", "Ask on Discord"),
      cardVideo: field("Product card video label", "Showcase"),
      available: field("Available status", "AVAILABLE"),
      soldOut: field("Sold out status", "SOLD OUT"),
      comingSoon: field("Coming soon status", "COMING SOON"),
    },
  },
  howItWorks: {
    label: "How it works",
    fields: {
      eyebrow: field("Eyebrow", "NO COMPLICATED CHECKOUT"),
      title: field("Heading", "Three steps. You’re in."),
      description: field(
        "Description",
        "Everything happens with our community.",
      ),
      firstTitle: field("First step heading", "Find your fit"),
      firstDescription: field(
        "First step description",
        "Browse products, check the features, and watch available showcases.",
        true,
      ),
      secondTitle: field("Second step heading", "Meet us on Discord"),
      secondDescription: field(
        "Second step description",
        "Join Just Zole and connect with the team to ask questions and check availability.",
        true,
      ),
      thirdTitle: field("Third step heading", "Get in the game"),
      thirdDescription: field(
        "Third step description",
        "Arrange your purchase on the server and get help from the people behind it.",
        true,
      ),
    },
  },
  howToUse: {
    label: "How to use / setup",
    fields: {
      eyebrow: field("Eyebrow", "GET STARTED"),
      title: field("Heading", "⚡ Quick & easy setup. ⚡"),
      firstNumber: field("First step marker", "1️⃣"),
      firstTitle: field("First step", "Run the Script"),
      secondNumber: field("Second step marker", "2️⃣"),
      secondTitle: field("Second step", "Launch the Game"),
      finish: field("Closing message", "🎮 That's it! Enjoy! 🔥"),
    },
  },
  reviews: {
    label: "Customer reviews",
    fields: {
      eyebrow: field("Eyebrow", "FROM THE COMMUNITY"),
      title: field("Heading", "Their experience. Their words."),
      description: field(
        "Description",
        "What our customers have to say about Just Zole.",
      ),
    },
  },
  rules: {
    label: "Server rules",
    fields: {
      eyebrow: field("Eyebrow", "THE COMMUNITY CODE"),
      title: field("Heading", "Server rules & regulations."),
      description: field(
        "Description",
        "Stay respectful. Stay safe. Enjoy your experience! ❤️",
      ),
      licenseTitle: field("License heading", "License policy"),
      licenseRules: field(
        "License rules (one per line)",
        "🔒 Each license is valid for ONE PC ONLY.\n❌ Licenses cannot be changed, replaced, or transferred to another PC.\n🚫 No refunds under any circumstances.",
        true,
      ),
      generalTitle: field("General rules heading", "General rules"),
      generalRules: field(
        "General rules (one per line)",
        "🤝 Respect everyone. Treat others with respect.\n🚫 No inappropriate, offensive, or unsafe content.\n📵 Do not misuse the server or spam.\n🔇 Spamming in any form is strictly prohibited.\n🎭 Catfishing and fake identities are strictly forbidden.",
        true,
      ),
      prohibitedTitle: field(
        "Prohibited activities heading",
        "Strictly prohibited",
      ),
      prohibitedRules: field(
        "Prohibited activities (one per line)",
        "💳 Do not purchase anything from anyone else.\n🔗 No Discord server invitation links or invite codes.\n🏛️ No political discussions.\n⛪ No religious discussions.\n📢 No advertising or promoting any content.\n🌐 Do not share links to other Discord servers.\n⚔️ Do not mention, advertise, or share information about other scripts.\n🔏 Sharing or leaking anyone's personal information is strictly prohibited.",
        true,
      ),
      noticeTitle: field("Notice heading", "Important notice"),
      notice: field(
        "Highlighted notice",
        "Failure to follow any of these rules will result in an immediate ban.",
        true,
      ),
      agreement: field(
        "Agreement",
        "By remaining in this server, you agree to follow all the rules listed above.",
        true,
      ),
    },
  },
  community: {
    label: "Community banner",
    fields: {
      eyebrow: field("Eyebrow", "MORE THAN A PRODUCT"),
      title: field("Heading", "Your next move starts here."),
      description: field(
        "Description",
        "New drops, product support, and players like you. All in one server.",
      ),
      button: field("Discord button", "Join Just Zole"),
    },
  },
  footer: {
    label: "Footer",
    fields: {
      tagline: field("Tagline", "Your game. Your edge."),
      products: field("Products link", "Explore products"),
      howToUse: field("How to use link", "How to use"),
      reviews: field("Reviews link", "Reviews"),
      rules: field("Rules link", "Server rules"),
      support: field("Support link", "Support on Discord"),
      account: field("Account link", "My account"),
      copyright: field(
        "Copyright (use {year} for the current year)",
        "© {year} Just Zole. All rights reserved.",
      ),
      note: field("Bottom note", "Browse here. Get it on Discord."),
    },
  },
};

export type HomepageSectionKey = keyof typeof homepageDefinitions;
export type HomepageSection = {
  visible: boolean;
  text: Record<string, string>;
};
export type HomepageContent = Record<HomepageSectionKey, HomepageSection>;
export const homepageKeys = Object.keys(
  homepageDefinitions,
) as HomepageSectionKey[];

export function defaultHomepageContent(): HomepageContent {
  return Object.fromEntries(
    homepageKeys.map((key) => [
      key,
      {
        visible: true,
        text: Object.fromEntries(
          Object.entries(homepageDefinitions[key].fields).map(
            ([name, definition]) => [name, definition.value],
          ),
        ),
      },
    ]),
  ) as HomepageContent;
}

export function mergeHomepageContent(
  rows: { key: string; visible: boolean; text: unknown }[],
): HomepageContent {
  const result = defaultHomepageContent();
  for (const row of rows) {
    if (!homepageKeys.includes(row.key as HomepageSectionKey)) continue;
    const section = result[row.key as HomepageSectionKey];
    section.visible = row.visible;
    if (
      typeof row.text !== "object" ||
      row.text === null ||
      Array.isArray(row.text)
    )
      continue;
    for (const [key, value] of Object.entries(row.text)) {
      if (Object.hasOwn(section.text, key) && typeof value === "string")
        section.text[key] = value;
    }
  }
  return result;
}
