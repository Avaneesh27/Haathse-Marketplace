import type { CommandResult } from "@/hooks/use-voice-command"

/**
 * Process a voice command using GPT
 * @param text - Transcribed text from voice input
 * @param context - Optional context for the command
 * @returns Processed command with intent, parameters, and response
 */
export async function processCommand(text: string, context: Record<string, any> = {}): Promise<CommandResult> {
  try {
    // In a real app, this would call your backend which would use the OpenAI API
    console.log("Processing command:", text, "Context:", context)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Simple intent detection for demo purposes
    let intent = "UNKNOWN"
    const parameters: Record<string, any> = {}
    let response = "I understood your request"

    const lowerText = text.toLowerCase()

    if (lowerText.includes("product") || lowerText.includes("उत्पाद")) {
      if (
        lowerText.includes("create") ||
        lowerText.includes("add") ||
        lowerText.includes("बनाओ") ||
        lowerText.includes("जोड़ें")
      ) {
        intent = "CREATE_PRODUCT"
        response = "Let's create a new product"
      } else if (
        lowerText.includes("search") ||
        lowerText.includes("find") ||
        lowerText.includes("खोजें") ||
        lowerText.includes("ढूंढें")
      ) {
        intent = "SEARCH_PRODUCTS"
        response = "Searching for products"

        // Extract search parameters
        if (lowerText.includes("handicraft") || lowerText.includes("हस्तशिल्प")) {
          parameters.category = "handicraft"
        } else if (lowerText.includes("food") || lowerText.includes("खाद्य")) {
          parameters.category = "food"
        }
      }
    } else if (lowerText.includes("order") || lowerText.includes("आदेश")) {
      if (lowerText.includes("accept") || lowerText.includes("स्वीकार")) {
        intent = "ACCEPT_ORDER"
        response = "Order accepted"
      } else if (lowerText.includes("decline") || lowerText.includes("reject") || lowerText.includes("अस्वीकार")) {
        intent = "DECLINE_ORDER"
        response = "Order declined"
      }
    } else if (lowerText.includes("go to") || lowerText.includes("navigate") || lowerText.includes("जाओ")) {
      intent = "NAVIGATE"

      if (lowerText.includes("home") || lowerText.includes("घर")) {
        parameters.path = "/"
        response = "Going to home page"
      } else if (lowerText.includes("profile") || lowerText.includes("प्रोफाइल")) {
        parameters.path = "/profile"
        response = "Going to your profile"
      } else if (lowerText.includes("seller") || lowerText.includes("विक्रेता")) {
        parameters.path = "/seller/dashboard"
        response = "Going to seller dashboard"
      } else if (lowerText.includes("buyer") || lowerText.includes("खरीदार")) {
        parameters.path = "/buyer/dashboard"
        response = "Going to buyer dashboard"
      }
    }

    return { intent, parameters, response }
  } catch (error) {
    console.error("Error processing command with GPT:", error)
    return {
      intent: "ERROR",
      parameters: {},
      response: "Sorry, I had trouble understanding that",
    }
  }
}

/**
 * Extract product details from a voice description
 * @param description - Voice description of a product
 * @returns Structured product details
 */
export async function extractProductDetails(description: string) {
  try {
    // In a real app, this would call your backend which would use the OpenAI API
    console.log("Extracting product details from:", description)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Return mock product details for demo
    return {
      name: "Handcrafted Pottery Bowl",
      description: "Beautiful handmade pottery bowl crafted by local artisans",
      category: "handicraft",
      price: 450,
      quantity: 5,
      unit: "piece",
    }
  } catch (error) {
    console.error("Error extracting product details:", error)
    throw new Error("Failed to extract product details")
  }
}
