export default function About() {
  return (
    <div className="font-openSans text-justify p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl text-center font-montserrat font-bold mb-4">À propos de nous</h1>

      <article className="p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl text-center font-montserrat font-bold my-7">Une mission de cœur</h2>
        <section className="space-y-4 ">
          <p>
            Chez Pet Foster Connect, nous croyons que chaque animal mérite une seconde chance. Notre
            plateforme solidaire est née d’un constat simple : les refuges débordent, et trop
            d’animaux attendent désespérément un foyer. Notre rôle est de créer ce lien précieux
            entre les associations de protection animale et les particuliers prêts à ouvrir leur
            maison et leur cœur, que ce soit pour un accueil temporaire ou une adoption définitive.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-2xl text-center font-montserrat font-bold my-7">
            Pourquoi nous existons
          </h2>
          <p>
            Chaque jour, des chiens, chats et autres compagnons sont abandonnés ou maltraités. Les
            refuges, saturés, manquent d’espace et de moyens.
          </p>
          <p>
            <ul className="list-disc list-inside text-left">
              <li>Les annonces d’adoption se perdent dans les réseaux sociaux.</li>
              <li>Les associations passent des heures à trier des candidatures incomplètes.</li>
              <li>
                Les particuliers, eux, peinent à trouver l’animal qui correspond vraiment à leur
                mode de vie.
              </li>
            </ul>
          </p>
          <p className="text-left">Nous avons voulu changer cela.</p>
        </section>
        <section className="mt-6 space-y-4">
          <h2 className="text-2xl text-center font-montserrat font-bold my-7">Notre promesse</h2>
          <p>
            Pet Foster Connect est bien plus qu’une plateforme : c’est un pont entre les animaux en
            détresse et les personnes prêtes à leur offrir une nouvelle vie.
          </p>
          <p>
            <ul className="list-disc list-inside text-left">
              <li>Nous regroupons tous les profils d’animaux sur un seul espace.</li>
              <li>Nous simplifions les démarches grâce à des formulaires clairs et adaptés.</li>
              <li>
                Nous soutenons les associations avec un tableau de bord qui leur fait gagner du
                temps.
              </li>
              <li>
                Nous responsabilisons les candidats en leur donnant accès à des informations
                précises sur chaque animal.
              </li>
            </ul>
          </p>
        </section>
        <section className="mt-6 space-y-4">
          <h2 className="text-2xl text-center font-montserrat font-bold my-7">
            Ensemble, sauvons des vies
          </h2>
          <p>
            Chaque accueil temporaire est une bouffée d’air pour un refuge. Chaque adoption est une
            histoire qui commence. Avec Pet Foster Connect, nous voulons que ces histoires se
            multiplient, et que plus aucun animal ne reste dans l’ombre.
          </p>
        </section>
      </article>
    </div>
  );
}
