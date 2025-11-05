import { Metadata } from 'next';
import DestinationPage from '@/components/destinations/DestinationPage';

type Props = {
  params: { destination: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const destinationName = params.destination
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${destinationName} - Hotels & Accommodation | MyRoom`,
    description: `Find the best hotels and accommodation in ${destinationName}. Book now with instant confirmation.`,
  };
}

export default function Page({ params, searchParams }: Props) {
  return <DestinationPage destination={params.destination} searchParams={searchParams} />;
}
