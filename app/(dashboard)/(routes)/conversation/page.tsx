"use client";

import axios from "axios";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import ReactMarkdown from "react-markdown";
import { useProModal } from "@/hooks/use-pro-modal";

// Define the message structure
type ChatCompletionRequestMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

// Define the form schema using zod
const formSchema = z.object({
  prompt: z.string().nonempty("Prompt is required"),
});

const ConversationPage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const userMessage: ChatCompletionRequestMessage = {
      role: "user",
      content: values.prompt,
    };

    try {
      // Send the user's message to the API
      const response = await axios.post("/api/conversation", {
        messages: [...messages, userMessage],
      });

      // Extract the assistant's message from the API response
      const assistantMessage: ChatCompletionRequestMessage = {
        role: "assistant",
        content: response.data?.message || "No response from assistant.",
      };

      // Update the messages state
      setMessages((prevMessages) => [...prevMessages, userMessage, assistantMessage]);

      // Reset the form after submission
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen(); // Open the Pro modal on forbidden error
      }

      // Handle unexpected errors
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: `Error: ${error.response?.data?.message || "An unknown error occurred."}` },
      ]);
    } finally {
      router.refresh(); // Optional refresh if needed
    }
  };

  return (
    <div>
      <Heading
        title="Conversation"
        description="Engage in a conversation with our AI assistant."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Ask anything..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                {isLoading ? "Generating..." : "Send"}
              </Button>
            </form>
          </Form>
        </div>

        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && <Empty label="No conversation started." />}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-8 w-full flex items-start gap-x-8 rounded-lg ${
                  message.role === "user" ? "bg-white border border-black/10" : "bg-muted"
                }`}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <ReactMarkdown
                  components={{
                    pre: ({ node, ...props }) => (
                      <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                        <pre {...props} />
                      </div>
                    ),
                    code: ({ node, ...props }) => (
                      <code className="bg-black/10 rounded-lg p-1" {...props} />
                    ),
                  }}
                  className={`text-sm overflow-hidden leading-7 ${
                    message.role === "assistant" ? "text-gray-900" : "text-black"
                  }`}
                >
                  {message.content || ""}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
