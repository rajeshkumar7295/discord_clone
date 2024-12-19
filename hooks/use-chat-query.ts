import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps {
    queryKey: string;
    apiUrl: string;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
}

export const useChatQuery = ({
    queryKey, apiUrl, paramKey, paramValue
}: ChatQueryProps) => {
    const { isConnected } = useSocket();

    const fetchMessages = async (context: { pageParam: any }) => {
        const url = qs.stringifyUrl({
            url: apiUrl,
            query: {
                cursor: context.pageParam,
                [paramKey]: paramValue,

            }
        } , { skipNull: true });
        const res = await fetch(url);
        return res.json();
    };

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        initialPageParam:null,
        refetchInterval: isConnected ? false : 1000
    });

    return {
        data, fetchNextPage, hasNextPage, isFetchingNextPage, status
    }
}