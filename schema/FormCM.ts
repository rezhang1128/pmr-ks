import { type Lists } from ".keystone/types";

import { graphql, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  checkbox,
  json,
  relationship,
  text,
  timestamp,
  virtual,
} from "@keystone-6/core/fields";
import { document } from "@keystone-6/fields-document";

import { createdAtField, updatedAtField } from "./fields/dates";

export const cmForm: Lists.cmForm = list({
  access: allowAll,
  fields: {
    label: virtual({
      field: graphql.field({
        type: graphql.String,
        async resolve(item, _args, ctx) {
          const client = (await ctx.query.Client.findOne({
            where: { id: item.clientId },
            query: "name",
          })) as unknown as Lists.Client.Item;
          const therapist = (await ctx.query.User.findOne({
            where: { id: item.therapistId },
            query: "name",
          })) as unknown as Lists.User.Item;

          return (
            `[${(item.treatmentDate ?? item.createdAt!).toISOString().replace("T", " ").replace("Z", "")}]` +
            ` ${client.name} - ${therapist.name}`
          );
        },
      }),
    }),
    client: relationship({
      ref: "Client",
      many: false,
      ui: { itemView: { fieldPosition: "sidebar" } },
    }),
    therapist: relationship({
      ref: "User",
      many: false,
      ui: { itemView: { fieldPosition: "sidebar" } },
    }),
    treatmentDate: timestamp({
      defaultValue: { kind: "now" },
      ui: { itemView: { fieldPosition: "sidebar" } },
    }),
    pregnant: checkbox({}),
    changes: document({ formatting: true }),
    tongue: json({ ui: { views: "./schema/views/tongue" } }),
    pulse: json({ ui: { views: "./schema/views/pulse" } }),
    baGang: json({ ui: { views: "./schema/views/ba-gang" } }),
    zangFu: text({}),
    diagnosis: text({}),
    t: document({ formatting: true }),
    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});
