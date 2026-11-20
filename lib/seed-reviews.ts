import { db } from "./db";

export async function seedReviews() {
  return db.review.createMany({
    skipDuplicates: true,
    data: [
      {
        id: "initial-community-review-1",
        sortOrder: 0,
        content:
          "Amazing experience! I'm extremely happy with my purchase. The script is absolutely fantastic and exceeded my expectations! Everything works great, and I'm really satisfied. Thank you so much for your amazing work! Definitely won't be my last purchase! ❤️🔥",
      },
      {
        id: "initial-community-review-2",
        sortOrder: 1,
        content:
          "Thx a lot💙 in the beginning I had misunderstood with one of the support team then they owner contacted me and thx so much he Setup everything even the ps5 controller 💙 And explained everything 💙 Thanks a lot again",
      },
      {
        id: "initial-community-review-3",
        sortOrder: 2,
        content:
          "zole is the GOAT, been very fast, keeps his word & truly I would recommend 1000x to anyone. Whatever you purchase it’s def worth it from customer service to product, you won’t be disappointed! Thank you bro Forever a customer!",
      },
    ],
  });
}
