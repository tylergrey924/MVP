import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: [".git/**", ".next/**", "node_modules/**", "next-env.d.ts"]
  },
  ...nextVitals
];

export default eslintConfig;
