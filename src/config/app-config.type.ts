export type AppConfig = {
    nodeEnv: string;
    name: string;
    workingDirectory: string;
    usersDomain?: string;
    libraryDomain: string;
    port: number;
    apiPrefix: string;
    fallbackLanguage: string;
    headerLanguage: string;
};
