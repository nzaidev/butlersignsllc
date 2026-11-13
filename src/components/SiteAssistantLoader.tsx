import { getSuggestedPrompts } from "@/lib/chat-agent";
import { SiteAssistant } from "./SiteAssistant";

export function SiteAssistantLoader() {
  return <SiteAssistant suggestedPrompts={getSuggestedPrompts()} />;
}
