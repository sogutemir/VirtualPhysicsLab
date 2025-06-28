import { Stack } from 'expo-router';
import { useLanguage } from '../../components/LanguageContext';

export default function TheoryLayout() {
  const { t } = useLanguage();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t('Fizik Teorisi', 'Physics Theory'),
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="mechanics/newton-laws"
        options={{
          title: t("Newton'un Hareket Kanunları", "Newton's Laws of Motion"),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="mechanics/momentum"
        options={{
          title: t('Momentum ve Korunumu', 'Momentum and Conservation'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="mechanics/free-fall-gravity"
        options={{
          title: t('Serbest Düşüş ve Yerçekimi', 'Free Fall and Gravity'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="mechanics/simple-harmonic-motion"
        options={{
          title: t('Basit Harmonik Hareket', 'Simple Harmonic Motion'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="mechanics/energy-conservation"
        options={{
          title: t('Enerji Korunumu', 'Energy Conservation'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="waves/wave-theory"
        options={{
          title: t('Dalga Teorisi', 'Wave Theory'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="waves/interference-superposition"
        options={{
          title: t('Girişim ve Süperpozisyon', 'Interference and Superposition'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="waves/double-slit-experiment"
        options={{
          title: t('Çift Yarık Deneyi', 'Double Slit Experiment'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="waves/doppler-effect"
        options={{
          title: t('Doppler Etkisi', 'Doppler Effect'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="electricity/electric-fields"
        options={{
          title: t('Elektrik Alanlar', 'Electric Fields'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="electricity/ohm-law-resistance"
        options={{
          title: t('Ohm Yasası ve Direnç', 'Ohm\'s Law and Resistance'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="electricity/kirchhoff-laws"
        options={{
          title: t('Kirchhoff Yasaları', 'Kirchhoff Laws'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="electricity/capacitors-capacitance"
        options={{
          title: t('Kapasitör ve Kapasitans', 'Capacitors and Capacitance'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="electricity/magnetic-fields"
        options={{
          title: t('Manyetik Alanlar', 'Magnetic Fields'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="electricity/rc-circuits"
        options={{
          title: t('RC Devreleri', 'RC Circuits'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="electricity/transformers"
        options={{
          title: t('Transformatörler', 'Transformers'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="basics/vectors-scalars"
        options={{
          title: t('Vektörler ve Skalerler', 'Vectors and Scalars'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="modern/photoelectric-effect"
        options={{
          title: t('Fotoelektrik Olay', 'Photoelectric Effect'),
          headerShown: false,
        }}
      />
    </Stack>
  );
}
