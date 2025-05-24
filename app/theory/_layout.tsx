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
        name="waves/wave-theory"
        options={{
          title: t('Dalga Teorisi', 'Wave Theory'),
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
        name="basics/vectors-scalars"
        options={{
          title: t('Vektörler ve Skalerler', 'Vectors and Scalars'),
          headerShown: false,
        }}
      />
    </Stack>
  );
}
