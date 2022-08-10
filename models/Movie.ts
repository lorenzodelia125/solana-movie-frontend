import * as borsh from "@project-serum/borsh";

export class Movie {
  title: string;
  rating: number;
  description: string;

  // lo schema del buffer - indica come deve essere serializzato
  // ogni attributo dell'oggetto passato come argomento alla
  // funzione encode
  // schema di instruction_data
  borshInstructionSchema = borsh.struct([
    borsh.u8("variant"),
    borsh.str("title"),
    borsh.u8("rating"),
    borsh.str("description"),
  ]);

  // schema del pda (stato)
  static borshAccountSchema = borsh.struct([
    borsh.bool("is_initialized"),
    borsh.u8("rating"),
    borsh.str("description"),
    borsh.str("title"),
  ]);

  constructor(title: string, rating: number, description: string) {
    this.title = title;
    this.rating = rating;
    this.description = description;
  }

  serialize(): Buffer {
    // crea il buffer
    const buffer = Buffer.alloc(1000);

    // encode serializza l'oggetto passato come primo argomento
    // in formato binario e lo inserisce nel buffer passato
    // come secondo argomento
    this.borshInstructionSchema.encode({ ...this, variant: 0 }, buffer);

    // subarray ritorna un nuovo buffer della dimensione realmente
    // occupata dall'oggetto serializzato
    return buffer.subarray(0, this.borshInstructionSchema.getSpan(buffer));
  }

  static deserialize(buffer?: Buffer): Movie | null {
    if (!buffer) return null;

    try {
      const { title, rating, description } =
        this.borshAccountSchema.decode(buffer);
      return new Movie(title, rating, description);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
