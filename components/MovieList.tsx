import { Card } from "./Card";
import { FC, useEffect, useState } from "react";
import { Movie } from "../models/Movie";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, AccountInfo } from "@solana/web3.js";

const MOVIE_REVIEW_PROGRAM_ID = "Ab6tVs5bNytCtUA1JUPSLhuLGiJuVHGJaNFYbARYkwgS";

type MovieAccountState = {
  pubkey: PublicKey;
  account: AccountInfo<Buffer>;
};

export const MovieList: FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const { connection } = useConnection();

  useEffect(() => {
    (async () => {
      const moviesAccounts: MovieAccountState[] =
        await connection.getProgramAccounts(
          new PublicKey(MOVIE_REVIEW_PROGRAM_ID)
        );

      const reviews: Movie[] = moviesAccounts
        .filter((m) => m != null)
        .map((m) => {
          console.log(m);
          const movie = Movie.deserialize(m.account.data)!;
          return movie;
        });

      if (reviews) {
        setMovies(reviews);
      }
    })();
  }, [connection]);

  return (
    <div>
      {movies.map((movie, i) => {
        return <Card key={i} movie={movie} />;
      })}
    </div>
  );
};
