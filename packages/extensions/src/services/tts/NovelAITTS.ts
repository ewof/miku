import axios from "axios";
import {
  TTSService,
  TTSServiceConfig,
  TTSServiceInput,
  TTSServiceOutput,
} from "./TTSService";

export class NovelAITTSService extends TTSService {
  constructor(config: TTSServiceConfig) {
    super({
      ...config,
      apiEndpoint: "https://api.novelai.net/ai/generate-voice",
    });
  }

  protected override async computeInput(input: TTSServiceInput): Promise<TTSServiceOutput> {
    const voiceSeed = input.voiceId || "Anananan"; // default unisex voice seed
    return axios<ArrayBuffer>({
      url: this.apiEndpoint,
      method: "get",
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "User-Agent": "mikugg",
      },
      params: {
        text: input.prompt,
        seed: voiceSeed,
        opus: false, // mp3 is supported in more browsers
        voice: -1, // always -1 for v2
        version: "v2",
      },
      validateStatus: (status) => status === 200,
    })
      .then((response) => {
        return (
          "data:audio/mpeg;base64," +
          Buffer.from(response.data).toString("base64")
        );
      })
      .catch((err) => {
        console.log("Error: ", err);
        return "";
      });
  }
}
