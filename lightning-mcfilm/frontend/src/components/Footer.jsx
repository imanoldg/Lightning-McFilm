import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return(
    <footer className="mt-12 w-full bg-mc-red py-6 border-t-4 border-mc-orange">
      <div className="max-w-md mx-auto px-8 text-center">
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-mc-orange rounded-full flex items-center justify-center font-bold text-mc-dark text-xl">
            ⚡
          </div>
          <h3 className="text-2xl font-bold text-white tracking-wider">
            {t('home.title')}
          </h3>
        </div>

        <p className="text-mc-light-blue text-sm mb-4">
          © 2025 {t('home.title')}. Todos los derechos reservados.
        </p>

        <div className="flex justify-center gap-6 text-white text-sm">
          <a href="#" className="hover:text-mc-orange transition">
            {t('footer.terms')}
          </a>
          <a href="#" className="hover:text-mc-orange transition">
            {t('footer.privacy')}
          </a>
          <a href="#" className="hover:text-mc-orange transition">
            {t('footer.contact')}
          </a>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="w-32 h-1 bg-mc-orange rounded-full"></div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;