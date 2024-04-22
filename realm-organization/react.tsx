import {
  PropsWithChildren,
  ProviderExoticComponent,
  ProviderProps,
  createContext,
  useContext,
} from "react";

export function createProvider<T = any>(
  data: any
): [ProviderExoticComponent<ProviderProps<any>>, () => T] {
  const res = createContext(data);
  const useProvider = () => {
    return useContext(res) as T;
  };
  return [res.Provider, useProvider];
}
export function createProviderFn<T>(
  fn: any
  //@ts-ignore
): [({ children }: PropsWithChildren) => JSX.Element, () => ReturnType<T>] {
  const res = createContext({});
  const Provider = ({ children }: PropsWithChildren) => {
    const value = fn();
    return <res.Provider value={value}>{children}</res.Provider>;
  }; //@ts-ignore
  type rt = ReturnType<T>;
  const useProvider = (): rt => {
    return useContext(res) as rt;
  };
  return [Provider, useProvider];
}
