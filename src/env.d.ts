/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type AdvancedRuntime<T> = import("@astrojs/cloudflare").AdvancedRuntime<T>;
type R2Bucket = import("@cloudflare/workers-types").R2Bucket;

type Env = {
  BUCKET: R2Bucket;
};

declare namespace App {
  interface Locals extends AdvancedRuntime<Env> {}
}
