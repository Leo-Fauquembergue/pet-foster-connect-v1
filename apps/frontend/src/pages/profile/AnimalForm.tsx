import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { CreateAnimalSchema } from "@projet/shared-types";
import { api } from "../../api/api";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export default function AnimalForm() {
  const { id } = useParams<{ id: string }>(); // id du refuge (userId)
  const navigate = useNavigate();
  const location = useLocation();
  const animal = location.state?.animal; // si on vient de "Modifier", on récupère l’animal

  const [species, setSpecies] = useState<{ id: number; name: string }[]>([]);

  const [formData, setFormData] = useState<any>({
    name: animal?.name ?? "",
    age: animal?.age ?? "",
    description: animal?.description ?? "",
    sex: animal?.sex ?? "unknown",
    weight: animal?.weight ?? "",
    height: animal?.height ?? "",
    animalStatus: animal?.animalStatus ?? "available",
    photos: animal?.photos ?? [],
    acceptOtherAnimals: animal?.acceptOtherAnimals ?? false,
    acceptChildren: animal?.acceptChildren ?? false,
    needGarden: animal?.needGarden ?? false,
    treatment: animal?.treatment ?? "",
    speciesId: animal?.species?.id ?? "",
  });

  // Charger les espèces
  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const res = await fetch(`${API_URL}/species`);
        const data = await res.json();
        setSpecies(data);
      } catch (err) {
        console.error("Erreur chargement espèces:", err);
        toast.error("Impossible de charger les espèces.");
      }
    };
    fetchSpecies();
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedData = {
      ...formData,
      weight: formData.weight === "" ? undefined : Number(formData.weight),
      height: formData.height === "" ? undefined : Number(formData.height),
      speciesId: formData.speciesId === "" ? undefined : Number(formData.speciesId),
    };

    try {
      const parsed = CreateAnimalSchema.parse(parsedData);

      if (animal) {
        // Mode édition → PATCH
        await api.patch(`/animals/${animal.id}`, parsed);
        toast.success("Animal modifié avec succès 🎉");
      } else {
        // Mode création → POST
        const payload = { ...parsed, pfcUserId: Number(id) };
        await api.post(`/animals`, payload);
        toast.success("Animal créé avec succès 🎉");
      }

      navigate(-1);
    } catch (err: any) {
      console.error(err);
      // Gestion d'erreur Zod ou API
      if (err.response) {
        toast.error(`Erreur serveur: ${err.response.statusText}`);
      } else if (err.issues) {
        // Erreur Zod
        toast.error("Formulaire invalide : vérifiez les champs.");
      } else {
        toast.error("Erreur lors de l'enregistrement.");
      }
    }
  };

  return (
    <div className="bg-bgapp font-openSans text-gray-800">
      <main className="container mx-auto px-4 py-8 flex-grow">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* SECTION PHOTOS */}
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden shadow-lg h-[400px] bg-gray-200">
              <img
                src={formData.photos[0] || "https://placehold.co/600x600"}
                alt={formData.name || "Nouvel animal"}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <label>Photos (URLs séparées par des virgules)</label>
              <input
                value={formData.photos}
                onChange={(e) =>
                  handleChange(
                    "photos",
                    e.target.value.split(",").map((url) => url.trim())
                  )
                }
                className="border p-2 w-full"
              />
            </div>
          </div>

          {/* SECTION INFORMATIONS */}
          <div className="bg-gray-100 p-8 rounded-lg shadow-sm text-left flex flex-col items-start h-full">
            
            {/* Infos générales */}
            <div className="mb-6 w-full">
              <h2 className="text-xl font-bold text-success mb-2">
                {animal ? "Modifier l'animal" : "Créer un nouvel animal"}
              </h2>
              <input type="text" placeholder="Nom" value={formData.name} onChange={(e)=>handleChange("name",e.target.value)} className="border p-2 w-full mb-2"/>
              <input type="number" placeholder="Âge" value={formData.age} onChange={(e)=>handleChange("age",e.target.value)} className="border p-2 w-full mb-2"/>
              <select value={formData.sex} onChange={(e)=>handleChange("sex",e.target.value)} className="border p-2 w-full mb-2">
                <option value="male">Mâle</option>
                <option value="female">Femelle</option>
                <option value="unknown">Inconnu</option>
              </select>
              <select value={formData.speciesId} onChange={(e)=>handleChange("speciesId",Number(e.target.value))} className="border p-2 w-full mb-2">
                <option value="">-- Sélectionner une espèce --</option>
                {species.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select value={formData.animalStatus} onChange={(e)=>handleChange("animalStatus",e.target.value)} className="border p-2 w-full">
                <option value="available">Disponible</option>
                <option value="adopted">Adopté</option>
                <option value="foster_care">Famille d'accueil</option>
                <option value="unavailable">Indisponible</option>
              </select>
            </div>

            {/* Caractéristiques physiques */}
            <div className="mb-6 w-full">
              <h2 className="text-xl font-bold text-success mb-2">Caractéristiques physiques</h2>
              <input type="number" placeholder="Poids (kg)" value={formData.weight} onChange={(e)=>handleChange("weight",e.target.value)} className="border p-2 w-full mb-2"/>
              <input type="number" placeholder="Taille (cm)" value={formData.height} onChange={(e)=>handleChange("height",e.target.value)} className="border p-2 w-full"/>
            </div>

            {/* Compatibilité */}
            <div className="mb-6 w-full">
              <h2 className="text-xl font-bold text-success mb-2">Compatibilité</h2>
              <label className="mx-1"><input type="checkbox" checked={formData.acceptChildren} onChange={(e)=>handleChange("acceptChildren",e.target.checked)} /> Ok enfants</label>
              <label className="mx-1"><input type="checkbox" checked={formData.acceptOtherAnimals} onChange={(e)=>handleChange("acceptOtherAnimals",e.target.checked)} /> Ok animaux</label>
              <label className="mx-1"><input type="checkbox" checked={formData.needGarden} onChange={(e)=>handleChange("needGarden",e.target.checked)} /> Besoin de jardin</label>
            </div>

            {/* Santé */}
            <div className="mb-6 w-full">
              <h2 className="text-xl font-bold text-success mb-2">Soins & Traitements</h2>
              <input type="text" placeholder="Traitement médical" value={formData.treatment} onChange={(e)=>handleChange("treatment",e.target.value)} className="border p-2 w-full"/>
            </div>

            {/* Description */}
            <div className="mb-6 w-full">
              <h2 className="text-xl font-bold text-success mb-2">Description</h2>
              <textarea value={formData.description} onChange={(e)=>handleChange("description",e.target.value)} className="border p-2 w-full"/>
            </div>

            {/* Boutons */}
            <div className="border-t-2 border-gray-300 pt-6 flex justify-between w-full mt-auto">
              <button type="button" onClick={()=>navigate(-1)} className="bg-gray-400 text-white px-4 py-2 rounded">Annuler</button>
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
                Sauvegarder
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
