import { apiSlice } from "../../app/api/apiSlice"

export const chatApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        chatWithAI: builder.mutation({
            query: message => ({
                url: 'api/chat',
                method: 'POST',
                body: { message },
            }),
        }),
    }),
})

export const {
    useChatWithAIMutation,
} = chatApiSlice
