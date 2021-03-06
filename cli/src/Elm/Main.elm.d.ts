import prompts from 'prompts';

export namespace Elm {
  namespace Main {
    interface App {
      ports: Ports;
    }

    type Arg = {
      flags: {
        argv: string;
        token?: string;
      };
    };

    interface Ports {
      output: Subscribe<prompts.PromptObject<'value'>>;
      exit: Subscribe<[number, string]>;
      save: Subscribe<string>;
      read: Subscribe<string>;
      readFile: Send<string>;
      uploadImage: Subscribe<string>;
      makeOGP: Subscribe<string>;
      openFile: Subscribe<string>;

      input: Send<any>;
      uploadResult: Send<string>;
    }

    interface Subscribe<T> {
      subscribe(cb: (value: T) => void): void;
    }

    interface Send<T> {
      send(value: T): void;
    }

    function init(arg: Arg): App;
  }
}
