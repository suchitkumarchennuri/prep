import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { dummyInterviews } from "@/constants";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewsByUserId(user?.id!),
    await getLatestInterviews({
      userId: user?.id!,
      limit: 20,
    }),
  ]);

  const hasPastInterviews = userInterviews && userInterviews.length > 0;
  const hasLatestInterviews = latestInterviews && latestInterviews.length > 0;
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get interview ready with AI. Practice job interviews with AI.</h2>
          <p className="text-lg">
            Practice on real interview questions and get instant feedback
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview"> Start an Interview</Link>
          </Button>
        </div>
        <Image
          src="/robot.png"
          alt="robot"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>
      <section className="flex flex-col gap-6 col-8 ">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>there are no interviews taken yet</p>
          )}
        </div>
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an interview </h2>
        <div className="interviews-section">
          {hasLatestInterviews ? (
            latestInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>there are no new interviews available</p>
          )}
        </div>
      </section>
    </>
  );
};

export default page;
