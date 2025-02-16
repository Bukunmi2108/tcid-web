export default function Meaning({ meaning }) {
  const definition = meaning

  return (
    <section className="mt-8 tablet:mt-10 tablet:text-body-m">
      <div className="flex items-center mb-8 tablet:mb-10">
        <hr className="w-full border-gray-2 dark:border-black-4" />
      </div>

      <p className="text-gray tablet:text-heading-s tablet:leading-heading-s">Meaning</p>
      <p className="mx-4 mt-4 text-2xl">{definition}</p>
    </section>
  )
}
