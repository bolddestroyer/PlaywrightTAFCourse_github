import { STORAGE_STATE } from '@_pw-config';
import { FullConfig, request } from '@playwright/test';
import * as fs from 'fs';

async function globalSetup(config: FullConfig): Promise<void> {
  if (fs.existsSync(STORAGE_STATE)) {
    fs.unlinkSync(STORAGE_STATE);
  }
  //console.log('⚠️  URL:', process.env.BASE_URL);
  const baseURL = config.projects[0].use.baseURL;
  const requestContext = await request.newContext();

  try {
    await requestContext.get(baseURL!);
    //const response = await requestContext.get(baseURL!);
    //console.log(response.ok());
  } catch {
    throw new Error(
      `❌ Failed to connect to ${baseURL} 
      check if the application is running and the baseUrl is correct`,
    );
  }
}

export default globalSetup;
