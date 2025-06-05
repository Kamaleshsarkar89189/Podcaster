"use client";

import { useUser, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import ProfileCard from "@/components/ProfileCard";

const CurrentUserProfilePage = () => {
  const { user } = useUser();

  const clerkId = user?.id;

  const userData = useQuery(api.users.getUserById, clerkId ? { clerkId } : "skip");
  const podcastsData = useQuery(api.podcasts.getPodcastByAuthorId, clerkId ? { authorId: clerkId } : "skip");

  if (!user || !userData || !podcastsData) return <LoaderSpinner />;

  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        Podcaster Profile
      </h1>

      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
        //@ts-ignore
          podcastData={podcastsData}
          imageUrl={userData.imageUrl}
          userFirstName={userData.name}
        />
      </div>

      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">All Podcasts</h1>
        {podcastsData.podcasts.length > 0 ? (
          <div className="podcast_grid">
            {podcastsData.podcasts.slice(0, 4).map((podcast) => (
              <PodcastCard
                key={podcast._id}
                //@ts-ignore
                imgUrl={podcast.imageUrl}
                title={podcast.podcastTitle}
                description={podcast.podcastDescription}
                podcastId={podcast._id}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="You have not created any podcasts yet"
            buttonLink={clerkId ? "/create-podcast" : undefined}
            buttonText={clerkId ? "Create Podcast" : undefined}
          />
        )}
      </section>
    </section>
  );
};

const Page = () => {
  return (
    <>
      <SignedIn>
        <CurrentUserProfilePage />
      </SignedIn>
      <SignedOut>
        <div className="text-white-1 mt-10 text-center">
          Please <SignInButton /> to view your profile.
        </div>
      </SignedOut>
    </>
  );
};

export default Page;
