/**
 * Dummy transcription service.
 * In later phases, this can connect to a real speech-to-text API.
 */

const logger = require('../utils/logger');

const transcriptionService = {
  /**
   * Simulates converting an audio file URL to text.
   */
  async transcribeAudio(audioUrl) {
    logger.info(`Simulating transcription for: ${audioUrl}`);

    // Dummy delay to simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return mock transcription text
    return `Transcribed text for audio at: ${audioUrl}`;
  }
};

module.exports = transcriptionService;
