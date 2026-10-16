/**
 * Satellite / Remote Sensing MRV Adapter
 *
 * ⚠️ NOT CONNECTED IN V1 ⚠️
 *
 * All MRV in v1 is manual admin verification.
 * This adapter provides the interface for a future satellite data provider
 * (e.g., Satelligence, Trimble, or ISRO Bhuvan).
 *
 * DO NOT use stub results to claim verification. 
 * Only real satellite data from a connected provider counts.
 */

export interface PlotBoundary {
  geoJson: string; // GeoJSON polygon
}

export interface MRVResult {
  provider: string;
  retrievedAt: string;
  ndviScore?: number;
  soilCarbonEstimateTonPerHa?: number;
  practiceDetected?: string;
  confidence?: number;
  rawData?: unknown;
  isStub: true | false;
  stubWarning?: string;
}

export interface SatelliteAdapter {
  isConnected: boolean;
  getPlotMRV(plotBoundary: PlotBoundary, seasonYear: number): Promise<MRVResult>;
}

class StubSatelliteAdapter implements SatelliteAdapter {
  isConnected = false;

  async getPlotMRV(plotBoundary: PlotBoundary, seasonYear: number): Promise<MRVResult> {
    return {
      provider: "stub",
      retrievedAt: new Date().toISOString(),
      isStub: true,
      stubWarning:
        "⚠️ Satellite MRV is not connected in v1. This result is a stub and must NOT be used to claim verification. Contact admin for manual MRV.",
    };
  }
}

function createSatelliteAdapter(): SatelliteAdapter {
  const provider = process.env.SATELLITE_PROVIDER ?? "stub";
  // Future: if (provider === "satelligence") return new SatelligenceAdapter();
  return new StubSatelliteAdapter();
}

export const satelliteAdapter = createSatelliteAdapter();
