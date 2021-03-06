import Head from "next/head";
import Image from "next/image";

import StarIcon from '@mui/icons-material/Star';

import clientPromise from "../../lib/mongodb";

import {
  Button,
  Box,
  Typography,
  Slider,
  Rating,
  Stack,
  LinearProgress,
  CircularProgress,
  Alert,
  AlertTitle,
} from "@mui/material";

import { useState } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

export default function Home({ movie, basePath}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [ableVoting, setAbleVoting] = useState(false);
  const [sliderValue, setSliderValue] = useState(65);
  const [starRating, setStarRating] = useState(3.5);
  const [responseErrorStatus, setResponseErrorStatus] = useState([]);
  const [requestLoading, setRequestLoading] = useState(false);

  let rating = 0;
  let starRatingCount = 0;

  const metacriticBlockProperties = {
    fontSize: 19,
    position: "absolute",
    bottom: 0,
    height: "fit-content",
    width: "fit-content",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "column",
    textAlign: "center",
    color: "whitesmoke",
    padding: "10px 14px 10px 14px",
  };

  async function handleRatingRequest() {
    setRequestLoading(true);
    const userEmail = session?.user?.email;
    const dataToBeSent = {
      userEmail,
      rating: sliderValue,
      star_rating: starRating,
      movieID: movie.id,
    };
    const res = await fetch(`${basePath}/api/ratings/handleratings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToBeSent),
    });
    const data = await res.json();
    if (data.error == true) {
      setResponseErrorStatus([data.error, data.statusMsg]);
    } else {
      setResponseErrorStatus([data.error, data.statusMsg]);
    }
    setRequestLoading(false);
  }

  if (router.isFallback) {
    return (
      <Stack
        sx={{
          position: "absolute",
          left: 0,
          width: "100%",
          color: "rgb(253,70, 4)",
        }}
      >
        <LinearProgress sx={{color: 'orange', bgcolor: 'orange'}} />
      </Stack>
    );
  }

  return (
    <div>
      <Head>
        <title>{movie?.movie}</title>
        <meta name="description" content="Here you can find a Specific Movie" />
        <meta name="keywords" content={`Movie, Film, ${movie?.movie}`}></meta>
        <link rel="icon" href="/companyLogo.ico" />
      </Head>

      <Box
        sx={{
          width: "60%",
          height: "fit-content",
          margin: "auto",
          padding: "15px 50px 30px 50px",
        }}
      >
        <Typography variant="h3" fontWeight={500} mb={2} mt={2}>
          {movie?.movie}
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            height: "fit-content",
            position: "relative",
          }}
        >
          <Image src={movie?.img_src} width={260} height={400} alt="movie poster" />

          {movie?.voters?.map((vote) => {
            rating = rating + vote?.rating;
          })}

          {!rating ? (
            <Box
              sx={{
                bgcolor: "rgb(65,120,135)",
                ...metacriticBlockProperties,
                padding: 0.5,
              }}
            >
              <Typography sx={{ fontWeight: 500, fontSize: 15 }}>
                no votes yet
              </Typography>
            </Box>
          ) : (
            <Box
              sx={metacriticBlockProperties}
              style={
                rating / movie?.voters?.length > 70
                  ? { backgroundColor: "rgb(56,142,60)" }
                  : { backgroundColor: "rgb(244,67,54)" }
              }
            >
              <Typography sx={{ fontWeight: 500 }}>
                {parseInt(rating / movie?.voters?.length)}{" "}
              </Typography>
            </Box>
          )}

          <div style={{ marginLeft: 15, height: "120px" }}>
            <Typography mt={1} mb={1.5}>
              Year: {movie?.year}
            </Typography>
            <Typography>Director: {movie?.director}</Typography>
            <Typography mt={1} mb={1.5}>
              Genre: {movie?.genre}
            </Typography>
            <Typography mt={1} mb={1.5}>
              Rating: {parseInt(rating / movie?.voters?.length)}
            </Typography>

            {movie?.voters?.map((vote) => {
              starRatingCount = starRatingCount + vote?.star_rating;
            })}
            <Typography mt={1} mb={1.5} sx={{display: 'flex', alignItems:'center', justifyContent: 'flex-start' }}>
              <span style={{ color: 'orange', fontSize: 4}}><StarIcon/></span>{parseFloat(starRatingCount / movie?.voters?.length)}
            </Typography>
          </div>
        </div>
        <Typography mt={2} mb={2}>
          {movie?.description}
        </Typography>

        <Button sx={{fontWeight: 700}}variant="contained" onClick={()=> router.back() }>
         
            Go back to movies
        
        </Button>

        <Button
          variant="text"
          sx={{ float: "right", fontWeight: 700}}
          onClick={() =>
            session ? setAbleVoting(!ableVoting) : signIn("google")
          }
        >
          vote
        </Button>

        <Box sx={{ mt: 6, mb: 8, height: 30 }}>
          {ableVoting ? (
            <>
              <Slider
                sx={{ mb: 2, color: 'orange' }}
                valueLabelDisplay="on"
                defaultValue={65}
                onChange={(e) => setSliderValue(e.target.value)}
              />

              <Rating
                size="large"
                precision={0.5}
                name="valueHating"
                defaultValue={3.5}
                onChange={(e) => setStarRating(e.target.value)}
              />

              <Button
                variant="contained"
                
                sx={{ float: "right",}}
                onClick={() => handleRatingRequest()}
              >
                send
              </Button>
            </>
          ) : (
            <></>
          )}

          
            {responseErrorStatus[0] == false ? (
              <Alert severity="success" sx={{ mt: 7, mb: 7 }}>
                <AlertTitle>Success</AlertTitle>
                Your rating has been <strong>successfully</strong> sent
              </Alert>
            ) : (
              <></>
            )}
          {responseErrorStatus[0] ? (
            <Alert severity="error" sx={{ mt: 7, mb: 7}}>
              <AlertTitle>Error</AlertTitle>
              Your rating has <strong>failed</strong>. {responseErrorStatus[1]}
            </Alert>
          ) : (
            <></>
          )}

        </Box>

        {requestLoading ? <Box sx={{display: 'flex', justifyContent:' center'}}><CircularProgress sx={{mt: 10, color: 'orange'}}/></Box> : <></>}
      </Box>
    </div>
  );
}


export async function getStaticProps(context) {
 

  const client = await clientPromise;
  const db = await client.db(process.env.MONGODB_DB);
  const FoundMovie = await db.collection(process.env.COLLECTION).find({ id: context.params.id }).toArray();
  return {
    props: {movie: JSON.parse(JSON.stringify(FoundMovie[0])), basePath: process.env.BASE_PATH},
    revalidate: 20,
  };
}

export async function getStaticPaths() {
  const client = await clientPromise;
  const db = await client.db(process.env.MONGODB_DB);
  const movies = await db.collection(process.env.COLLECTION).find().limit(10000).toArray();
  const ids = await movies.map(movie => { 
    return { params: { id: movie.id } }
  })
  return {
    paths: ids,
    fallback: false,
  };
}