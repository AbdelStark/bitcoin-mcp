// API response types
interface BlockstreamBlock {
  id: string;
  height: number;
  timestamp: number;
  tx_count: number;
  size: number;
  weight: number;
}

interface BlockstreamTxStatus {
  confirmed: boolean;
  block_height?: number;
  block_hash?: string;
  block_time?: number;
}

interface BlockstreamTxPrevout {
  value: number;
  scriptpubkey: string;
  scriptpubkey_address?: string;
}

interface BlockstreamTxVin {
  txid: string;
  vout: number;
  sequence: number;
  prevout?: BlockstreamTxPrevout;
}

interface BlockstreamTxVout {
  value: number;
  scriptpubkey: string;
  scriptpubkey_address?: string;
}

interface BlockstreamTx {
  txid: string;
  version: number;
  locktime: number;
  size: number;
  weight: number;
  fee: number;
  status: BlockstreamTxStatus;
  vin: BlockstreamTxVin[];
  vout: BlockstreamTxVout[];
}
