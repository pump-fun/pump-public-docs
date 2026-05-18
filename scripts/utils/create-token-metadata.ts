import { setGlobalDispatcher, Agent } from "undici";

export type CreateTokenMetadata = {
  name: string;
  symbol: string;
  description: string;
  file: Blob;
  twitter?: string;
  telegram?: string;
  website?: string;
};

export const createTokenMetadata = async (create: CreateTokenMetadata) => {
  let formData = new FormData();
  try {
    (formData.append("file", create.file),
      formData.append("name", create.name),
      formData.append("symbol", create.symbol),
      formData.append("description", create.description),
      formData.append("twitter", create.twitter || ""),
      formData.append("telegram", create.telegram || ""),
      formData.append("website", create.website || ""),
      formData.append("showName", "true"));
    setGlobalDispatcher(new Agent({ connect: { timeout: 60_000 } }));
    let request = await fetch("https://pump.fun/api/ipfs", {
      method: "POST",
      headers: {
        Host: "www.pump.fun",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        Referer: "https://www.pump.fun/create",
        Origin: "https://www.pump.fun",
        Connection: "keep-alive",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        Priority: "u=1",
        TE: "trailers",
      },
      body: formData,
    });
    return request.json();
  } catch (error) {
    return { success: false, error: error };
  }
};
