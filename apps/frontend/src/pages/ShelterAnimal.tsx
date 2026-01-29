//page de la liste des refuge.
// url --> http://localhost:5173/refuges
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import _AnimalCard from "../components/AnimalCard";
import BackBanner from "../components/ui/BackBanner";

const API_URL = import.meta.env.VITE_API_URL;

const ShelterAnimalsPage = () => {
  const { id } = useParams<{ id: string }>();

  const [shelter, setShelter] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShelter = async () => {
      try {
        if (!id) return; // évite l'appel avec undefined
        const res = await fetch(`${API_URL}/shelters/${id}`);
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        const data = await res.json();
        setShelter(data);
      } catch (err) {
        console.error("Erreur API:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShelter();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!shelter) return <p>Refuge introuvable</p>;

  return (
    <div className="bg-bgapp font-openSans text-gray-800">
      <BackBanner to="/refuges" />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">
          {`Animaux du ${shelter.shelterName}`}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {shelter.user?.animals?.map((animal: any) => (
            <Link key={animal.id} to={`/animaux/${animal.id}`}>
              <_AnimalCard {...animal} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShelterAnimalsPage;
